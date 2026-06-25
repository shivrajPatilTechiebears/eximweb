import { Icon } from "./Icon";

interface ActionButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}

export function EditActionButton({ onClick, title = "Edit" }: ActionButtonProps) {
  return (
    <button onClick={onClick} className="btn-icon" title={title}>
      <Icon name="edit" size={16} />
    </button>
  );
}

export function DeleteActionButton({ onClick, title = "Delete" }: ActionButtonProps) {
  return (
    <button onClick={onClick} className="btn-icon-danger" title={title}>
      <Icon name="delete" size={16} />
    </button>
  );
}
