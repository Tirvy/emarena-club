const CF = {

  checkStringInString(where, what, options) {

    if (where === '' && !what) {
      return true;
    }
    if (!where) {
      return false;
    }
    if (!what) {
      return true;
    }
    if (Array.isArray(where) && where.length) {
      where = where.join(' ');
    }
    where = where
      .toString()
      .trim()
      .toLowerCase();
    what = what.trim();

    function simpleCheck() {
      return where.indexOf(what.toLowerCase()) !== -1;
    }

    return simpleCheck();
  }
}

export default CF;
