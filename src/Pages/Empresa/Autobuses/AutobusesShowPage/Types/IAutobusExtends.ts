import IAutobus from "@/Types/IAutobus";
import IPiso from "@/Types/IPiso";

export default interface IAutobusExtends extends IAutobus {
    pisos: IPiso[]
}