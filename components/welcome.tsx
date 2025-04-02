import { CardContent } from "./ui/card";

export const WelcomeComponent = () => {
  return (
    <CardContent className="p-0.5">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Willkommen beim Wuerfelblock!
      </h2>
      <p className="text-muted-foreground text-center">
        Keine vorherigen Spiele gefunden. Starte ein neues Spiel, um Scores zu
        verfolgen.
      </p>
    </CardContent>
  );
};
