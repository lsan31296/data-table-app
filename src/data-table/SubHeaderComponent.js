
/**
 * This component will be responsible for the subheaders as requested by Andy. 
 * Including styles and alignments
 * This component must be a component or array of components
 */
const SubHeaderComponent =
        
        <div className="btn-group dropstart">
            <button id="horizontal-dropdown-btn" type="button" className="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Legend
            </button>
            <ul className="dropdown-menu" aria-labelledby="horizontal-dropdown-btn" id="horizontal-dropdown-list">
                <li className="dropdown-item"><button type="button" className="btn btn-sm btn-primary">Position</button></li>
                <li className="dropdown-item"><button type="button" className="btn btn-sm btn-danger">Risk</button></li>
                <li className="dropdown-item"><button type="button" className="btn btn-sm btn-warning">Rating</button></li>
                <li className="dropdown-item"><button type="button" className="btn btn-sm btn-info">KRD</button></li>
                <li className="dropdown-item"><button type="button" className="btn btn-sm btn-dark">Performance</button></li>
            </ul>
        </div>
        
        /*
        <div className="btn-group dropstart">
        <button id="horizontal-dropdown-btn" type="button" className="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Legend
        </button>
        <ul className="dropdown-menu" aria-labelledby="horizontal-dropdown-btn" id="horizontal-dropdown-list">
            <button type="button" className="btn btn-sm btn-primary dropdown-item">Position</button>
            <button type="button" className="btn btn-sm btn-danger dropdown-item">Risk</button>
            <button type="button" className="btn btn-sm btn-warning dropdown-item">Rating</button>
            <button type="button" className="btn btn-sm btn-info dropdown-item">KRD</button>
            <button type="button" className="btn btn-sm btn-dark dropdown-item">Performance</button>
        </ul>
        </div>
        */
;
export default SubHeaderComponent;