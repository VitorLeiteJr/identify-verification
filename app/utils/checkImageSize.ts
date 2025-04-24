function base64Size(base64: string): number {
    const stringLength = base64.length - "data:image/jpeg;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes / (1024 * 1024); // MB
  }

  export default base64Size;