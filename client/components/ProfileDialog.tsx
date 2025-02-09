import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { User } from "@/types";

const ProfileDialog = ({
  open,
  user,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto h-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">My profile</DialogTitle>
        </DialogHeader>
        <div className="w-full h-auto flex items-center justify-center gap-5">
          <div className="w-36 h-36 rounded-full overflow-hidden">
            <img
              src={user?.avatar}
              alt="logo"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex items-start justify-start flex-col gap-2">
            <p className="flex items-center justify-start gap-2 text-lg font-semibold">
              Id: <span className="font-medium text-gray-600">{user?.id}</span>
            </p>
            <p className="flex items-center justify-start gap-2 text-lg font-semibold">
              Name:{" "}
              <span className="font-medium text-gray-600">
                {user?.username}
              </span>
            </p>
            <p className="flex items-center justify-start gap-2 text-lg font-semibold">
              Email:{" "}
              <span className="font-medium text-gray-600">{user?.email}</span>
            </p>
            <p className="flex items-center justify-start gap-2 text-lg font-semibold">
              Role:{" "}
              <span className="font-medium text-gray-600">{user?.role}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
