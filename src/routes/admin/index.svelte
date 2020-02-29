<script context="module">
    export async function preload(page, session){
        if (session.auth == false){
            this.redirect(302, '/');
        }
    }
</script>

<div class="dashboard">
    <div class="main-data">
        <div class="card">
            <div class="main">
                <div class="data">
                    <span style="font-size: 1.4rem;">Users</span>
                    <span style="font-size: 1.8rem;">423</span>
                    <span style="    font-size: 0.7rem;margin-top: 0.5rem;">6% higher than last month</span>
                </div>
                <div class="icon">
                    <i class="na-user-friends"></i>
                </div>
            </div>
            <div class="footer">
                <div class="bar">
                    <div class="progress" style="width: 35%;"></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="main">
                <div class="data">
                    <span style="font-size: 1.4rem;">Posts</span>
                    <span style="font-size: 1.8rem;">345</span>
                    <span style="    font-size: 0.7rem;margin-top: 0.5rem;">7% higher than last month</span>
                </div>
                <div class="icon">
                    <i class="na-pen-square"></i>
                </div>
            </div>
            <div class="footer">
                <div class="bar">
                    <div class="progress" style="width: 45%;"></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="main">
                <div class="data">
                    <span style="font-size: 1.4rem;">Replies</span>
                    <span style="font-size: 1.8rem;">678</span>
                    <span style="    font-size: 0.7rem;margin-top: 0.5rem;">15% higher than last month</span>
                </div>
                <div class="icon">
                    <i class="na-comments"></i>
                </div>
            </div>
            <div class="footer">
                <div class="bar">
                    <div class="progress" style="width: 75%;"></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="main">
                <div class="data">
                    <span style="font-size: 1.4rem;">Views</span>
                    <span style="font-size: 1.8rem;">2345</span>
                    <span style="    font-size: 0.7rem;margin-top: 0.5rem;">45% higher than last month</span>
                </div>
                <div class="icon">
                    <i class="na-rocket"></i>
                </div>
            </div>
            <div class="footer">
                <div class="bar">
                    <div class="progress" style="width: 73%;"></div>
                </div>
            </div>
        </div>
    </div>
</div>
