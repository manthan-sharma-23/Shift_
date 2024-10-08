// Enhanced function to map file extensions to Monaco Editor languages
export const getLanguageFromFileExtension = (file: string): string => {
  const extension = file.split(".").pop()?.toLowerCase();

  const extensionMapping: { [key: string]: string } = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    json: "json",
    xml: "xml",
    yml: "yaml",
    yaml: "yaml",
    md: "markdown",
    markdown: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    php: "php",
    go: "go",
    rb: "ruby",
    rs: "rust",
    swift: "swift",
    sql: "sql",
    sh: "shell",
    bat: "bat",
    cmd: "bat",
    r: "r",
    kt: "kotlin",
    kts: "kotlin",
    pl: "perl",
    ps1: "powershell",
    lua: "lua",
    dart: "dart",
    erl: "erlang",
    groovy: "groovy",
    vbs: "vbscript",
    vb: "vb",
    coffee: "coffeescript",
    toml: "toml",
    ini: "ini",
    conf: "ini",
    config: "ini",
    log: "log",
    txt: "plaintext",
  };

  return extension ? extensionMapping[extension] || "plaintext" : "plaintext";
};
