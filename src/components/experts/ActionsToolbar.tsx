import { Edit, Trash } from "lucide-react";
import React from "react";

type ActionsToolbarProps = {
    onDelete: () => void;
    onEdit: () => void;
};

const ActionsToolbar = ({ onDelete, onEdit }: ActionsToolbarProps) => {
    return (
        <div className="flex justify-end gap-6">
            <button
                className="flex flex-col items-center gap-2 text-xs"
                onClick={onEdit}
            >
                <Edit className="stroke-green-400" />
                Edit
            </button>
            <button
                onClick={onDelete}
                className="flex flex-col items-center gap-2 text-xs"
            >
                <Trash className="stroke-red-400" />
                Delete
            </button>
        </div>
    );
};

export default ActionsToolbar;
