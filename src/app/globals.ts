export class Globals {
  public static isDark = true;
  public static uid = null;

  public static countObj(obj: {}): number {
    let cpt = 0;

    if (obj) {
      cpt = Object.keys(obj).length;
    }
    return cpt;
  }
}
