import {
  Accordion as BaseAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@leetcraft/ui/components/accordion';

interface Props {
  data: {
    title: string;
    description: string;
  }[];
}

export function Accordion({ data }: Props) {
  return (
    <BaseAccordion type="single" collapsible className="w-full space-y-4">
      {data.map((item, i) => {
        return (
          <AccordionItem
            className="bg-card rounded-md px-4"
            key={i}
            value={`item-${i.toFixed()}`}
          >
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </BaseAccordion>
  );
}
