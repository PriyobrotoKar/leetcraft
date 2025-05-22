import { Input } from '@leetcraft/ui/components/input';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface TagsInputProps {
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

function TagsInput({
  initialTags = [],
  onTagsChange = () => {},
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputValue = event.currentTarget.value.trim();
      if (inputValue) {
        setTags((prevTags) => [...prevTags, inputValue]);
        event.currentTarget.value = '';
      }
    }
  };

  const removeTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onTagsChange(tags);
  }, [tags]);

  return (
    <div className="flex items-center gap-2 px-3">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-border inline-flex items-center gap-2 rounded-sm px-2 py-1 text-sm"
        >
          {tag}
          <IconX
            className="text-muted-foreground hover:text-foreground size-3 cursor-pointer transition-colors"
            onClick={() => removeTag(index)}
          />
        </span>
      ))}
      <Input
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-none border-none px-0 focus-visible:ring-0 dark:bg-transparent"
      />
    </div>
  );
}

export default TagsInput;
