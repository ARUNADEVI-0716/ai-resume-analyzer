export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    loadPromise = import("pdfjs-dist/legacy/build/pdf.js").then((lib) => {
        // Assign worker from public folder
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}


export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 3 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        await page.render({ canvasContext: ctx, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve({
                        imageUrl: "",
                        file: null,
                        error: "Failed to create image blob",
                    });
                    return;
                }

                const name = file.name.replace(/\.pdf$/i, "");
                const imageFile = new File([blob], `${name}.png`, {
                    type: "image/png",
                });

                resolve({
                    imageUrl: URL.createObjectURL(blob),
                    file: imageFile,
                });
            }, "image/png");
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
