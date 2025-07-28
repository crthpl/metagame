import { DbSessionView } from "@/types/database/dbTypeAliases";

export const dbGetHostsFromSession = (session: DbSessionView) => {
  const host1Name = (session.host_1_first_name ?? "") + " " + (session.host_1_last_name  ?? "")
  const host2Name = (session.host_2_first_name ?? "") + " " + (session.host_2_last_name  ?? "")
  const host3Name = (session.host_3_first_name ?? "") + " " + (session.host_3_last_name  ?? "")
  return [host1Name, host2Name, host3Name].filter(name => name !== " ")
}

