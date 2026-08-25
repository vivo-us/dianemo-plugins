import { tryHandleRequest } from "@dianemo/plugin-kit";
import { LabelaryData } from "./types.js";

export const convertZPL = async (
  clientName: string,
  data: LabelaryData
): Promise<Buffer> => {
  // Omitting the index segment is Labelary's documented way to get *all* labels as
  // one PDF; pinning it to `0` returned page one of a batch. PDF only, hence the
  // `0` elsewhere: docs/labelary-api.md#omitting-the-index-segment-returns-every-label-as-one-pdf
  const wantsAllPages =
    data.index === undefined && data.format === "application/pdf";
  const index = wantsAllPages ? "" : `${data.index ?? 0}/`;
  const res = await tryHandleRequest<Buffer>(
    {
      clientName,
      requestName: "labelary.labels.convertZpl",
      method: "POST",
      responseType: "arraybuffer",
      data: data.label,
      url: `/printers/${data.dpi}dpmm/labels/${data.width}x${data.height}/${index}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: data.format,
      },
    },
    "LBL_0001",
    "Failed to convert ZPL via Labelary"
  );
  return res.data;
};
