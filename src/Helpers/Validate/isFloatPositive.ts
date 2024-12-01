export default function isFloatPositve(value: string) {
    return value != '' && parseFloat(value) && parseFloat(value) > 0
}