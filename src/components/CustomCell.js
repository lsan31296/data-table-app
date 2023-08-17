

export default function CustomCell ({ cellData }) {
    return (
        <div>
            <div data-tag="allowRowEvents" style={{ overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipses' }}>
                {cellData}
            </div>
        </div>
    )
}