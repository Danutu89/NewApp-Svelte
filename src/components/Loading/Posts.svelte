<div class="articles">
    <div class="navigation-menu">
        <a href="/"><button>Home</button></a>
        <a href="/questions"><button>Questions</button></a>
        <a href="/discuss"><button>Discuss</button></a>
        <a href="/tutorials"><button>Tutorials</button></a>
    </div>
    {#each Array(3) as x}
        <div class="article-card">
            <div class="article-main">
                    <div class="article-author-image loading" style="width: 50px;height: 50px;border-radius: 50px;margin-bottom: 0.5rem;"></div>
                <div class="article-info">
                    <div class="article-title loading" style="width: 20rem;height: 1.4rem;margin-bottom: 0.5rem;"></div>
                    <div class="article-author loading" style="width: 4rem;height: 0.7rem;margin-bottom: 0.5rem;"></div>
                    <div class="article-tags loading" style="width: 5rem;height: 0.9rem;margin-bottom: 0.5rem;"></div>
                </div>
                </div>
                <div class="article-footbar">
                <div class="article-date loading" style="height: 0.6rem;width: 6rem;"></div>
                <div class="article-misc">
                        <div class="article-readtime loading" style="margin-right: 0.4rem;height: 0.6rem;width: 4rem;margin-top: 0.4rem;"></div>
                </div>
            </div>
        </div>
    {/each}
</div>