"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface GenreMultiSelectProps {
  value: number[];
  onChange: (genreIds: number[]) => void;
  genres: { id: number; name: string; description?: string }[];
  placeholder?: string;
  className?: string;
}

export function GenreMultiSelect({
  value,
  onChange,
  genres,
  placeholder = "Chọn thể loại...",
  className,
}: GenreMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Filter genres based on search
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get selected genres
  const selectedGenres = genres.filter((genre) => value.includes(genre.id));

  // Check if a genre is selected
  const isSelected = (genreId: number) => value.includes(genreId);

  // Handle selecting a genre
  const handleSelect = (genreId: number) => {
    if (isSelected(genreId)) {
      onChange(value.filter((id) => id !== genreId));
    } else {
      onChange([...value, genreId]);
    }
  };

  // Remove a selected genre
  const handleRemove = (genreId: number) => {
    onChange(value.filter((id) => id !== genreId));
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-9 py-2"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedGenres.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedGenres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(genre.id);
                    }}
                  >
                    {genre.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command>
            <CommandInput
              placeholder="Tìm kiếm thể loại..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="max-h-48">
              <CommandGroup>
                {filteredGenres.map((genre) => (
                  <CommandItem
                    key={genre.id}
                    value={genre.name}
                    onSelect={() => handleSelect(genre.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(genre.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {genre.name}
                    {genre.description && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {genre.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {filteredGenres.length === 0 && (
                <CommandEmpty>
                  <div className="p-2 text-sm text-muted-foreground">
                    Không tìm thấy thể loại nào.
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
