interface CounterProps {
    title: string;
    value: number;
}

function Counter({ title, value }: CounterProps) {
    return (
    <div className="col-md-4">
        <div className="card text-center mb-3">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="display-6">{value}</p>
            </div>
        </div>
    </div>
    );
}

export default Counter;