import React from 'react';
import './OverviewBlock.css';

function OverviewBlock() {
    return (
        <div className="block overview-block" id="overview-block">
            <div className="overview-content">
                <div className="overview-text" id="overview-text">
                    <h2 className="colored-text">Are you ready to land a tech internship for Summer 2023 or later?</h2>
                    <h3 className="text-main">Simplify your job search journey through Career++!</h3>
                    <p>   
                    At Career++, <strong>expand your network</strong> by connecting with recruiters and industry professionals from companies looking to fill tech related internship positions. 
                    Networking is the <strong>best way</strong> to find a job - don’t miss this <em>amazing opportunity</em> to kickstart your career!
                    </p>
                    <h4 className="text-main">Reach the finish line by attending this tech-focused career fair to learn more about available 
                    internships, what each company and their recruitment process is like, and how to stand out as an applicant. </h4>
                </div>
                <div className="overview-text gradient-border-padded" id="overview-text">
                    <h3 className="text-main">Career++ will run from <em>11:00 AM to 3:00 PM</em> in the Donadeo Innovation Center for Engineering at the University of Alberta North Campus (tentatively)</h3>
                </div>
            </div>
        </div>
    );
}

export default OverviewBlock;