<script>
export let json;


</script>

<div class="posts">
    <div>
        <div class="main-data">
            <div class="row">
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Posts Density</span>
                            <span style="font-size: 1.8rem;">{json.main_data['posts_d']['now']}</span>
                            <span style="    font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">{json.main_data['posts_d']['perc']}</span>
                        </div>
                        <div class="icon">
                            <i class="na-user-friends"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: {json.main_data['posts_d']['perc_d']}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Views Density</span>
                            <span style="font-size: 1.8rem;">34</span>
                            <span style="font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">12</span>
                        </div>
                        <div class="icon">
                            <i class="na-pen-square"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: 12%;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Replies Density</span>
                            <span style="font-size: 1.8rem;">{json.main_data['replies_d']['now']}</span>
                            <span style="    font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">{json.main_data['replies_d']['perc']}</span>
                        </div>
                        <div class="icon">
                            <i class="na-comments"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: {json.main_data['replies_d']['perc_d']}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Likes Density</span>
                            <span style="font-size: 1.8rem;">342</span>
                            <span style="    font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">89</span>
                        </div>
                        <div class="icon">
                            <i class="na-rocket"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: 89%;"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>