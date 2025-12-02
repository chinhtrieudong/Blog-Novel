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

interface CategoryMultiSelectProps {
  value: number[];
  onChange: (categoryIds: number[]) => void;
  categories: { id: number; name: string; description?: string }[];
  placeholder?: string;
  className?: string;
}

export function CategoryMultiSelect({
  value,
  onChange,
  categories,
  placeholder = "Chọn danh mục...",
  className,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get selected categories
  const selectedCategories = categories.filter((category) =>
    value.includes(category.id)
  );

  // Check if a category is selected
  const isSelected = (categoryId: number) => value.includes(categoryId);

  // Handle selecting a category
  const handleSelect = (categoryId: number) => {
    if (isSelected(categoryId)) {
      onChange(value.filter((id) => id !== categoryId));
    } else {
      onChange([...value, categoryId]);
    }
  };

  // Remove a selected category
  const handleRemove = (categoryId: number) => {
    onChange(value.filter((id) => id !== categoryId));
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
              {selectedCategories.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(category.id);
                    }}
                  >
                    {category.name}
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
              placeholder="Tìm kiếm danh mục..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="max-h-48">
              <CommandGroup>
                {filteredCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleSelect(category.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(category.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                    {category.description && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {category.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {filteredCategories.length === 0 && (
                <CommandEmpty>
                  <div className="p-2 text-sm text-muted-foreground">
                    Không tìm thấy danh mục nào.
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
