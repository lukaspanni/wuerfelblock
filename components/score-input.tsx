import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import type { Category } from "./game-board";

interface ScoreInputProps {
  category: Category;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  category,
  inputValue,
  setInputValue,
}) => {
  if (category.type === "special") {
    return (
      <div className="w-full">
        <RadioGroup
          value={inputValue}
          onValueChange={setInputValue}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={category.points?.toString() ?? "0"}
              id="success"
            />
            <Label htmlFor="success">Erfolg ({category.points} Punkte)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="failed" />
            <Label htmlFor="failed">Nicht geschafft (0 Punkte)</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  return (
    <Input
      type="number"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Score eingeben"
    />
  );
};

export default ScoreInput;
