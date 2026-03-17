
export class UserHelpers {


  static getInitialUser(name: string): { initials: string; bgColor: string; textColor: string } {
    if (!name) return { initials: "", bgColor: "#000000", textColor: "#FFFFFF" };
    const words = name.trim().split(/\s+/);
    const initials = words.slice(0, 2).map(word => word[0].toUpperCase()).join("");
    function hashCode(str: string): string {
      let hash = 2166136261;
      for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash *= 16777619;
      }
      return (hash >>> 0).toString(16).padStart(6, "0").slice(0, 6);
    }
    const bgColor = `#${hashCode(name)}`;
    function getTextColor(hex: string): string {
      const rgb = hex.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
      const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      return luminance > 128 ? "#000000" : "#FFFFFF"; // Si clair, texte noir ; sinon, texte blanc
    }
    const textColor = getTextColor(bgColor);

    return { initials, bgColor, textColor };
  }
}