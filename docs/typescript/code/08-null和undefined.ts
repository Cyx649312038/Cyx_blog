function fn(a: string | null) {
    // console.log(a?.toLocaleLowerCase());
    // console.log(a.toLocaleLowerCase());//对象可能为 "null"
    console.log(a!.toLocaleLowerCase()) //!表示明确表示a不可能是undefined或者null

}

