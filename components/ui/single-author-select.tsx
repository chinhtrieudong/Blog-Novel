"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

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
import { AuthorCreateModal } from "@/components/ui/author-create-modal";
import apiClient from "@/lib/api-client";
import { AuthorResponse } from "@/types/api";

interface SingleAuthorSelectProps {
  value: AuthorResponse | null;
  onChange: (author: AuthorResponse | null) => void;
  placeholder?: string;
  className?: string;
}

export function SingleAuthorSelect({
  value,
  onChange,
  placeholder = "Chọn tác giả...",
  className,
}: SingleAuthorSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [authors, setAuthors] = React.useState<AuthorResponse[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  // Fetch authors on mount
  React.useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getAuthors();
        if (response.data) {
          setAuthors(response.data);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  // Filter authors based on search
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle selecting an author
  const handleSelect = (author: AuthorResponse) => {
    onChange(author);
    setOpen(false);
  };

  // Handle author created from modal
  const handleAuthorCreated = (newAuthor: AuthorResponse) => {
    setAuthors((prev) => [...prev, newAuthor]);
    onChange(newAuthor);
    setModalOpen(false);
  };

  // Clear selection
  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value ? value.name : placeholder}
            </span>
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
              placeholder="Tìm kiếm tác giả..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="max-h-48">
              <CommandGroup>
                {loading ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Đang tải tác giả...
                  </div>
                ) : (
                  filteredAuthors.map((author) => (
                    <CommandItem
                      key={author.id}
                      value={author.name}
                      onSelect={() => handleSelect(author)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.id === author.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {author.name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => setModalOpen(true)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo tác giả mới
                </CommandItem>
              </CommandGroup>
              {!loading &&
                filteredAuthors.length === 0 &&
                !searchValue.trim() && (
                  <CommandEmpty>
                    <div className="p-2 text-sm text-muted-foreground">
                      <p className="mb-2">Không tìm thấy tác giả nào.</p>
                      <p>Bắt đầu gõ để tìm kiếm hoặc tạo tác giả mới.</p>
                    </div>
                  </CommandEmpty>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AuthorCreateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAuthorCreated={handleAuthorCreated}
      />
    </div>
  );
}
