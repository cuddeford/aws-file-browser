interface InfoProps {
    title: string
    description: string
}

const Info = ({ title, description }: InfoProps) => {
    return <div>
        <h2>{title}</h2>
        <p>{description}</p>
    </div>
}

export default Info
