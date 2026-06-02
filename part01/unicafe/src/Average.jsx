const Average = ({good, neutral, bad}) => {
    const total = good+neutral+bad;
    const average = good*1 + neutral*0 + bad*-1

    return(
        <p>average {average/total}</p>
    )
}

export default Average