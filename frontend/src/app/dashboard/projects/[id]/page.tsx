export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    return <h1>Kanban Board do Projeto ID: {params.id}</h1>;
}