<script>
  export let label = 'Save';
  export let disabled = false;
  export let handleClick;

  function onClick(event) {
    if (!disabled && handleClick) {
      handleClick(event);
    }
  }
</script>

<button on:click="{onClick}" disabled="{disabled}">{label}</button>

<style>
  button {
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-weight: bold;
    cursor: pointer;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
