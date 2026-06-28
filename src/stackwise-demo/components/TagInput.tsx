import { useState } from "react";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Button } from "@/stackwise-demo/components/ui/button";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add tag and press Enter",
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      onChange([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={tags.length >= maxTags}
          data-testid="input-tag"
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={handleAddTag}
          disabled={!inputValue.trim() || tags.length >= maxTags}
          data-testid="button-add-tag"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1"
              data-testid={`tag-${tag}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:bg-background rounded-sm"
                data-testid={`button-remove-tag-${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum of {maxTags} tags reached
        </p>
      )}
    </div>
  );
}
