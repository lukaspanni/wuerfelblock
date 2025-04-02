import { twMerge } from "tailwind-merge";

export const SectionTotalRow = ({
  label,
  values,
  className,
}: {
  label: string;
  values: number[];
  className?: string;
}) => (
  <tr className={twMerge(`bg-muted border-muted border-t`, className)}>
    <td className="border-border/25 sticky left-0 border-r px-3 py-2 text-sm font-medium">
      {label}
    </td>
    {values.map((value, index) => (
      <td key={index} className="px-3 py-2 text-center text-sm font-medium">
        {value}
      </td>
    ))}
  </tr>
);
