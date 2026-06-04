import StatisticLine from './StatisticLine'

const Statistics = ({good, neutral, bad}) => {
    const total = good+neutral+bad;
    const average = (good*1 + neutral*0 + bad*-1) / total;
    const positiveFeedback = (good/total)*100;

    if(total === 0) {
        return(
            <div>      
                <h1>statistics</h1>
                <p>No feedback has been given.</p>
            </div>
        )
    }

    return(
    <>
        <h1>statistics</h1>
        <table>
            <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="total" value={total} />
                <StatisticLine text="average" value={average} />
                <StatisticLine text="positive" value={`${positiveFeedback} %`} />
            </tbody>
        </table>

    </>
    )
}

export default Statistics