import { Button } from "@/components/ui/button";

export const StartGameButton = ({
  onStartGame,
}: {
  onStartGame: () => void;
}) => {
  return (
    <Button onClick={onStartGame} className="w-full">
      Neues Spiel Starten
    </Button>
  );
};
