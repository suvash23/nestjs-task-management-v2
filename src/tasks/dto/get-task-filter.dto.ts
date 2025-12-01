import { TaskStatus } from "../task.model";
import { IsEnum, IsOptional } from "class-validator";

export class GetFilteredTasksDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    search?: string;
}