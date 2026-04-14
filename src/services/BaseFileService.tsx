import engine from "cohtml/cohtml";
import { DataProvider } from "../components/FilePickerDialog";

export class BaseFileService {
    static async generateDataProvider(baseCallPrefix: string, folder: string, allowedExtension: string): Promise<DataProvider> {
        return await BaseFileService.listFiles(baseCallPrefix, folder, allowedExtension)
    }
    static async listFiles(baseCallPrefix: string, folder: string, extensionAllowed: string): Promise<{ displayName: string, directory: boolean, fullPath: string }[]> { return await engine.call(`${baseCallPrefix}.file.listFiles`, folder, extensionAllowed); }
}
