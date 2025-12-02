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

interface TagMultiSelectProps {
  value: number[];
  onChange: (tagIds: number[]) => void;
  tags: { id: number; name: string; description?: string }[];
  placeholder?: string;
  className?: string;
}

export function TagMultiSelect({
  value,
  onChange,
  tags,
  placeholder = "Chọn tags...",
  className,
}: TagMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Filter tags based on search
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get selected tags
  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  // Check if a tag is selected
  const isSelected = (tagId: number) => value.includes(tagId);

  // Handle selecting a tag
  const handleSelect = (tagId: number) => {
    if (isSelected(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  // Remove a selected tag
  const handleRemove = (tagId: number) => {
    onChange(value.filter((id) => id !== tagId));
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
              {selectedTags.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(tag.id);
                    }}
                  >
                    {tag.name}
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
              placeholder="Tìm kiếm tags..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="max-h-48">
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag.name}
                    {tag.description && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {tag.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {filteredTags.length === 0 && (
                <CommandEmpty>
                  <div className="p-2 text-sm text-muted-foreground">
                    Không tìm thấy tag nào.
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
