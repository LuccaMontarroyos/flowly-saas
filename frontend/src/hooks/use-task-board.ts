import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { Task, TaskStatus, KanbanBoardData } from "@/types";
import { getProjectById } from "@/services/projects";
import { getProjectTasks, moveTask } from "@/services/tasks";
import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";

interface UseTaskBoardResult {
  project: any;
  isLoading: boolean;
  boardData: KanbanBoardData | null;
  viewMode: "board" | "list";
  setViewMode: (mode: "board" | "list") => void;
  search: string;
  setSearch: (value: string) => void;
  onlyMyTasks: boolean;
  setOnlyMyTasks: (value: boolean) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  createTaskStatus: TaskStatus;
  openCreateModal: () => void;
  handleAddFromColumn: (status: TaskStatus) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  handleTaskClick: (task: Task) => void;
  onDragEnd: (result: DropResult) => Promise<void>;
  getAllTasks: () => Task[];
}

export function useTaskBoard(projectId: string): UseTaskBoardResult {
  const { user } = useAuth();

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>(
    TaskStatus.TODO
  );

  const [localBoardData, setLocalBoardData] = useState<KanbanBoardData | null>(
    null
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [search, setSearch] = useState("");
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const debouncedSearch = useDebounce(search, 500);

  const hasActiveFilters =
    !!debouncedSearch || onlyMyTasks || priorityFilter !== "ALL";

  const {
    data: project,
    isLoading: isLoadingProject,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
  });

  const {
    data: serverBoardData,
    isLoading: isLoadingTasks,
  } = useQuery({
    queryKey: ["tasks", projectId, debouncedSearch, onlyMyTasks, priorityFilter],
    queryFn: () =>
      getProjectTasks(projectId, {
        search: debouncedSearch,
        priority: priorityFilter === "ALL" ? undefined : priorityFilter,
        assigneeId: onlyMyTasks ? user?.id : undefined,
      }),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (serverBoardData) {
      setLocalBoardData(serverBoardData);
    }
  }, [serverBoardData]);

  const openCreateModal = () => {
    setCreateTaskStatus(TaskStatus.TODO);
    setIsCreateTaskOpen(true);
  };

  const handleAddFromColumn = (status: TaskStatus) => {
    setCreateTaskStatus(status);
    setIsCreateTaskOpen(true);
  };

  const onDragEnd = async (result: DropResult) => {
    if (hasActiveFilters) {
      toast.info("Cannot reorder tasks while filters are active.", {
        description: "Clear filters to enable Drag & Drop.",
      });
      return;
    }

    const { destination, source, draggableId } = result;

    if (!destination || !localBoardData) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startStatus = source.droppableId as TaskStatus;
    const finishStatus = destination.droppableId as TaskStatus;

    const newBoard: KanbanBoardData = { ...localBoardData };

    const sourceList = Array.from(newBoard[startStatus]);
    const [movedTask] = sourceList.splice(source.index, 1);

    const updatedTask = { ...movedTask, status: finishStatus };

    if (startStatus === finishStatus) {
      sourceList.splice(destination.index, 0, updatedTask);
      newBoard[startStatus] = sourceList;
    } else {
      const destinationList = Array.from(newBoard[finishStatus]);
      destinationList.splice(destination.index, 0, updatedTask);
      newBoard[startStatus] = sourceList;
      newBoard[finishStatus] = destinationList;
    }

    setLocalBoardData(newBoard);

    try {
      await moveTask(draggableId, finishStatus, destination.index);
    } catch {
      toast.error("Failed to move task");
      if (serverBoardData) {
        setLocalBoardData(serverBoardData);
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const getAllTasks = () => {
    if (!localBoardData) return [];
    return [
      ...localBoardData.TODO,
      ...localBoardData.IN_PROGRESS,
      ...localBoardData.DONE,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const isLoading = isLoadingProject || isLoadingTasks || !localBoardData;

  return {
    project,
    isLoading,
    boardData: localBoardData,
    viewMode,
    setViewMode,
    search,
    setSearch,
    onlyMyTasks,
    setOnlyMyTasks,
    priorityFilter,
    setPriorityFilter,
    isCreateTaskOpen,
    setIsCreateTaskOpen,
    createTaskStatus,
    openCreateModal,
    handleAddFromColumn,
    selectedTask,
    setSelectedTask,
    handleTaskClick,
    onDragEnd,
    getAllTasks,
  };
}

