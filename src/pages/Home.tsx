export const Home = ({Jogos}:any) => {
    return (
        <div className="container mt-4">

            <div className="row">

                <div className="col-md-4">

                    <div className="card mb-3 text-center">
                        <h5>Jogos ao Vivo</h5>
                        <h2>{Jogos.length}</h2>
                    </div>

                </div>
            </div>
            
        </div>
    );
};