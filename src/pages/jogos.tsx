import { useEffect, useState } from "react";
import { getJogosAoVivo } from '../services/jogosService';
import { JogoCard} from '../components/JogoCard';

export const Jogos = () => {
    const [jogos, setJogos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJogos = async () => {
            try {
                const data = await getJogosAoVivo();
                setJogos(data);
            } catch (e) {
                setError("Erro ao carregar jogos ao vivo.");
            } finally {
                setLoading(false);
            }
        };

        fetchJogos();
    }, []);

    if (loading) {
        return <p className="text-center mt-5">Carregando jogos ao vivo...</p>
    }

    if (error) {
        return <p className="text-center mt-5 text-danger">{error}</p>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Jogos ao Vivo</h2>

            {jogos.length === 0 ? (
                <p className="text-center">Nenhum jogo ao vivo no momento.</p>
            
            ) : ( jogos.map((jogo, index) => ( <JogoCard key={index} jogo={jogo} /> )) )}
        </div>
    );
};