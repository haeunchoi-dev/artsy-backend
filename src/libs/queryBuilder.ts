class QueryBuilder {
  private setValueCount: number = 0;
  private query: string = '';

  public addText(text: string): QueryBuilder {
    this.query += text;
    return this;
  }

  public addSetValue(key: string, value: any): QueryBuilder {
    if (value === undefined) {
      return this;
    }

    let _value = value;
    if (typeof(_value) === 'string') {
      _value = `'${_value}'`;
    }

    if (this.setValueCount === 0) {
      this.query += ` SET ${key} = ${_value} `;
    } else {
      this.query += `, ${key} = ${_value} `;
    }

    this.setValueCount += 1;
    return this;
  }

  public getQuery(): string {
    return this.query;
  }
}

export default QueryBuilder;