import React from "react";

import { MdAdd } from "react-icons/md";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CreateUpdateProps {
  type: "create" | "update";
  title: string;
  data?: Object;
}

export const CreateUpdate = ({ type, title, data }: CreateUpdateProps) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600  right-10 bottom-10">
            <MdAdd className="text-[32px] text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-[#2B85FF] hover:bg-blue-600 w-full"
              >
                Add
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
