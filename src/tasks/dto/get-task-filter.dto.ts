import { TaskStatus } from "../task.model";

export class GetFilteredTasksDto {
    status?: TaskStatus;
    search?: string;
}