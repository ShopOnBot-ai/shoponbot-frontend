import { Product } from "@/types/products";
import { useState } from "react";

export const useDialog = <TAction extends string = string, TData = null>() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<TData | null>()
  const [actionType, setActionType] = useState<TAction | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const openDialog = (id: number | null, type: TAction, data: TData | null = null) => {
    setSelectedId(id);
    setActionType(type);
    setIsOpen(true);
    setSelectedData(data)
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedId(null);
    setActionType(null);
    setIsActionLoading(false);
  };

  return {
    isOpen,
    setIsOpen,
    selectedId,
    actionType,
    isActionLoading,
    setIsActionLoading,
    openDialog,
    closeDialog,
    selectedData,
    setSelectedData
  };
};
