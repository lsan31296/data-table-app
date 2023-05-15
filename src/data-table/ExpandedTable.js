

const ExpandedTable = ({ data }) => {
    
    const rows = Object.entries(data).map(([key, value]) => {
        return (
            <tr>
                <td>{key}</td>
                <td>{value}</td>
            </tr>
        )
    });

    //console.log(rows);

    return (
        <>
        <table>
            {rows}
        </table>
        </>
    )
}

export default ExpandedTable;