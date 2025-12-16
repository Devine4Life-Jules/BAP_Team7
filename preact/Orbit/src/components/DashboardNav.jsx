import { Link, Match } from 'preact-router/match';

export default function DashboardNav() {
    return (
        <div className="dashboard-nav">
            <ul>
                <li>
                    <Match path="/dashboard" exact>
                        {({ matches }) => (
                            <Link class={matches ? 'active' : 'inactive'} href="/dashboard">Home</Link>
                        )}
                    </Match>
                </li>
                <li>
                    <Match path="/dashboard/list" exact>
                        {({ matches }) => (
                            <Link class={matches ? 'active' : 'inactive'} href="/dashboard/list">Projects</Link>
                        )}
                    </Match>
                </li>
            </ul>
        </div>
    );
}
