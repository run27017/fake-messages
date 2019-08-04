function toNamedContact (address, name) {
  if (name) {
    return name + ' <' + address + '>'
  } else {
    return address
  }
}

export {
  toNamedContact
}

