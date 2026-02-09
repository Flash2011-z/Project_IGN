import { useParams } from "react-router-dom";

export default function GameDetails() {
  const params = useParams();

  return (
    <div>
      <h1>Game Details</h1>
      <p>Game ID: {params.id}</p>
    </div>
  );
}