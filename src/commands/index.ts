import { Command as ManagerConfig } from "./manager-config";
import { Command as ManagerLog } from "./manager-log";
import { Command as ManagerRestart } from "./manager-restart";
import { Command as ManagerRun } from "./manager-run";
import { Command as ManagerStart } from "./manager-start";
import { Command as ManagerStatus } from "./manager-status";
import { Command as ManagerStop } from "./manager-stop";

export const Commands = [
    ManagerConfig,
    ManagerLog,
    ManagerRestart,
    ManagerRun,
    ManagerStart,
    ManagerStatus,
    ManagerStop,
];
