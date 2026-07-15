const useFileDownloader = () => {
  const downloadFile = async (url, filename) => {
    try {
      console.log(url, filename);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return { downloadFile };
};

export default useFileDownloader;
