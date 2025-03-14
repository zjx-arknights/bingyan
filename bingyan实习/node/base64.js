//base64解码
function decodeBase64(base64Str) {
    // 解码 Base64 字符串为二进制字符串
    const binaryStr = atob(base64Str);

    // 将二进制字符串转为字节数组（处理非 ASCII 字符）
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }

    // 将字节数组解码为 UTF-8 字符串
    return new TextDecoder().decode(bytes);
}