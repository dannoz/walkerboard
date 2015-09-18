export function getDemoData() {
    return [
        [ "single value", { value: 12345 } ],
        [ "value and secondary (less)", { value: 12345, secondary: 1234 } ],
        [ "value and secondary (more)", { value: 12345, secondary: 23456 } ],
        [ "value and secondary (text)", { value: 12345, secondary: "secondary" } ]
    ];
}
